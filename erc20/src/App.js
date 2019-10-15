import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import './App.css';
import ERC20Leaderboard from './erc20';
import Hud from './hud.js';
import ApolloClient from 'apollo-boost';
import { ApolloProvider, useQuery } from 'react-apollo';
import gql from 'graphql-tag';
import { IntrospectionFragmentMatcher, InMemoryCache } from 'apollo-cache-inmemory';
import introspectionQueryResultData from './fragmentTypes.json';

// The GraphQL server to connect to
// const uri = 'http://localhost:4000/graphql';
const uri = 'https://hack-ethql.infura.io'
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});
const cache = new InMemoryCache({ fragmentMatcher });
const client = new ApolloClient({ uri, cache });

const query = gql`
  {
    block(tag: LATEST) {
      number
      transactionCount
      transactions {
        to { type }
        from { type }
        decoded {
          operation
          ... on ERC20Transfer {
            tokenContract {
              symbol
            }
            value
          }
        }
      }
    }
  }
`;

const LeaderBoard = () => {
  const { loading, error, data } = useQuery(query, { pollInterval: 5000 });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Errors :(</p>;

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" className="title-bar">
            ERC20 Leaderboard
          </Typography>
          <Typography style={{ flexGrow: 1 }} color="inherit" variant="subtitle1">
            Latest Block: {data.block.number}
          </Typography>
        </Toolbar>
      </AppBar>
      <Hud txCount={data.block.transactionCount} transactions={data.block.transactions} />
      <ERC20Leaderboard transactions={data.block.transactions} />
    </div>
  );
}

const App = () => {
    return (
    <ApolloProvider client={client}>
      <LeaderBoard />
    </ApolloProvider>
  );
}

export default App;

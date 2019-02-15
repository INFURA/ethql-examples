import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import _ from 'lodash';

const styles = theme => ({
  compMain: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: '400px',
  },
});

const ERC20Leaderboard = props => {
  let { classes } = props;

  // Calculate total transfered value from the transactions
  // coming back from the current block.
  let leaderMap = _.chain(props.transactions)
    .flatMap(({ decoded }) => {
      // Unroll the transaction
      if (decoded && decoded.operation === 'transfer') {
        let { symbol } = decoded.tokenContract;
        return symbol
          ? {
              symbol,
              value: Number(decoded.value), // Ensure the value is parsed as a number
            }
          : null;
      }
    })
    .reduce((result, val) => {
      // Add all of the same tokens transactions
      if (val) {
        let { symbol, value } = val;
        result[symbol] = result.hasOwnProperty(symbol) ? result[symbol] + value : value;
      }
      return result;
    }, {})
    .toPairs()
    .orderBy([pair => pair[1]], ['desc'])
    .value();

  return (
    <Paper className={classes.compMain}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell align="right">Total Value in this block</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaderMap.map(pair => (
            <TableRow key={pair[0]}>
              <TableCell>{pair[0]}</TableCell>
              <TableCell align="right">{pair[1]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default withStyles(styles)(ERC20Leaderboard);

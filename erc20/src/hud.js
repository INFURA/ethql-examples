import React from 'react';
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { Person, Receipt } from '@material-ui/icons';
import { reduce } from 'lodash';

const parseTransactions = (txns) => (
  reduce(txns, (acc, cur) => {
    return (cur.to.type === 'EXTERNALLY_OWNED') ?
      Object.assign(acc, { external: acc.external + 1 }) :
      Object.assign(acc, { contract: acc.contract + 1 });
  }, { external: 0, contract: 0})
)

const Hud = ({ transactions, txCount }) => {
  const { external, contract } = parseTransactions(transactions);

  return (
    <Paper elevation={5}>
      <Typography variant="subtitle1">Total Transactions: { txCount }</Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary={external} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Receipt />
          </ListItemIcon>
          <ListItemText primary={contract} />
        </ListItem>
      </List>
    </Paper>
  )
}

export default Hud;
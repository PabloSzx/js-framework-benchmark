import React, { memo, useReducer, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { createGlobalState } from 'react-hooks-global-state';

function random(max) { return Math.round(Math.random() * 1000) % max; }

const A = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean",
  "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive",
  "cheap", "expensive", "fancy"];
const C = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
const N = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse",
  "keyboard"];

let nextId = 1;

function buildData(count) {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${N[random(N.length)]}`,
    };
  }
  return data;
}

const { useGlobalState, setGlobalState } = createGlobalState({ data: [], selected: 0 });

function doAction(action) {
  switch (action.type) {
    case 'RUN':
      setGlobalState('data', buildData(1000));
      setGlobalState('selected', 0);
      break;
    case 'RUN_LOTS':
      setGlobalState('data', buildData(10000));
      setGlobalState('selected', 0);
      break;
    case 'ADD':
      setGlobalState('data', data => data.concat(buildData(1000)));
      break;
    case 'UPDATE':
      setGlobalState('data', data => {
        const newData = data.slice(0);
        for (let i = 0; i < newData.length; i += 10) {
          const r = newData[i];
          newData[i] = { id: r.id, label: r.label + " !!!" };
        }
        return newData;
      });
      break;
    case 'CLEAR':
      setGlobalState('data', []);
      setGlobalState('selected', 0);
      break;
    case 'SWAP_ROWS':
      setGlobalState('data', data => [data[0], data[998], ...data.slice(2, 998), data[1], data[999]]);
      break;
    case 'REMOVE':
      setGlobalState('data', data => {
        const idx = data.findIndex((d) => d.id === action.id);
        return [...data.slice(0, idx), ...data.slice(idx + 1)];
      });
      break;
    case 'SELECT':
      setGlobalState('selected', action.id);
      break;
  }
}

const GlyphIcon = <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>;

const Row = memo(({ item, selected }) => {
  const select = useCallback(() => doAction({ type: 'SELECT', id: item.id }), []);
  const remove = useCallback(() => doAction({ type: 'REMOVE', id: item.id }), []);

  return (<tr className={selected ? "danger" : ""}>
    <td className="col-md-1">{item.id}</td>
    <td className="col-md-4"><a onClick={select}>{item.label}</a></td>
    <td className="col-md-1"><a onClick={remove}>{GlyphIcon}</a></td>
    <td className="col-md-6"></td>
  </tr>);
});

const Button = ({ id, cb, title }) => (
  <div className="col-sm-6 smallpad">
    <button type="button" className="btn btn-primary btn-block" id={id} onClick={cb}>{title}</button>
  </div>
);

const Jumbotron = memo(() => (
  <div className="jumbotron">
    <div className="row">
      <div className="col-md-6">
        <h1>react-hooks-global-state</h1>
      </div>
      <div className="col-md-6">
        <div className="row">
          <Button id="run" title="Create 1,000 rows" cb={() => doAction({ type: 'RUN' })} />
          <Button id="runlots" title="Create 10,000 rows" cb={() => doAction({ type: 'RUN_LOTS' })} />
          <Button id="add" title="Append 1,000 rows" cb={() => doAction({ type: 'ADD' })} />
          <Button id="update" title="Update every 10th row" cb={() => doAction({ type: 'UPDATE' })} />
          <Button id="clear" title="Clear" cb={() => doAction({ type: 'CLEAR' })} />
          <Button id="swaprows" title="Swap Rows" cb={() => doAction({ type: 'SWAP_ROWS' })} />
        </div>
      </div>
    </div>
  </div>
), () => true);

const Main = () => {
  const [data] = useGlobalState('data');
  const [selected] = useGlobalState('selected');

  return (<div className="container">
    <Jumbotron />
    <table className="table table-hover table-striped test-data"><tbody>
      {data.map(item => (
        <Row key={item.id} item={item} selected={item.id === selected} />
      ))}
    </tbody></table>
    <span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
  </div>);
};

ReactDOM.render(
  (
    <Main />
  ),
  document.getElementById('main')
);

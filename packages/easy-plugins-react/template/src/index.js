import React from 'react';
import ReactDOM from 'react-dom';
import './asset/less/index.less';
import './asset/less/other.less';

const Chat = () => (
  <div>
    <div className={'box'}>this is Chat12123</div>
    <div>fasdf</div>
  </div>
)

ReactDOM.render(
  <Chat/>,
  document.getElementById('app')
)
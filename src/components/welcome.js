const React = require('react');
const ChatList = require('./chat-list');


const Welcome = ({ controller }) => (
  <div className="app-container">
    <div className="heading">
      <h1>Emoj</h1>
    </div>
    <div className="main-panel">
      <ChatList controller={ controller } />
    </div>
  </div>
);


module.exports = Welcome;

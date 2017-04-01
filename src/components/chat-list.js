const React = require('react');
const uuid = require('uuid').v1;

const limitTo = (size, text) =>
  text.length > size ?  text.slice(0, size) + '...'
: /* otherwise */       text;

const last = (session) => {
  const item = session[session.length - 1];
  if (item) {
    return limitTo(50, item.text);
  } else {
    return '';
  }
}


const renderChat = (onClick) => ({ id, name, date, session, allowDelete }) => (
  <li className="item chat-item" key={id} onClick={ () => onClick({ id, name, date, session, allowDelete }) }>
    <h2 className="chat-title">{ name }</h2>
    <div className="output">{ last(session) }</div>
  </li>
);


class ChatList extends React.Component {
  constructor(props) {
    super(props);
    this.controller = props.controller;
    this.state = { chats: [] };
  }

  newChat() {
    const chatId = uuid();
    const chat = {
      name: 'New Chat',
      id: chatId,
      date: new Date,
      session: []
    };
    this.controller.toChat(chat);
  }

  openChat(chat) {
    this.controller.toChat(chat);
  }

  componentDidMount() {
    this.setState({ chats: JSON.parse(localStorage.chats || '[]') });
  }

  render() {
    return (
      <ul className="chat-list">
        <li className="item new-chat" onClick={ () => this.newChat() }>
          <h2 className="chat-title">+ New chat</h2>
        </li>
        { this.state.chats.map(renderChat((chat) => this.openChat(chat))) }
      </ul>
    )
  }
}


module.exports = ChatList;

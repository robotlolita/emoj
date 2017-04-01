const React = require('react');
const VM = require('../vm');
const EditInline = require('react-edit-inline').default;


const ListSession = ({ session }) => (
  <ul className="session-list">
    { session.map((x, i) => <li key={i} className={ x.type }>{ x.text }</li>) }
  </ul>
);

const keys = (object) => {
  const proto = Object.getPrototypeOf(object);
  return Object.keys(object).concat(proto != null ? keys(proto) : []);
};


class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.controller = props.controller;

    const chat = props.chat;
    this.state = {
      name: chat.name,
      id: chat.id,
      date: chat.date,
      session: chat.session,
      allowDelete: chat.allowDelete !== false,
      text: ''
    };

    this.vm = new VM('');
  }

  componentDidMount() {
    this.vm = new VM('');
    this.state.session.forEach(item => {
      if (item.type === 'input') {
        this.vm.newExecution(item.text);
      }
    });
  }

  handleInput(ev) {
    this.setState({ text: ev.target.value });
  }

  handleKey(ev) {
    if (ev.key === 'Enter' && !ev.shiftKey) {
      this.run();
    }
  }

  updateName({ name }) {
    this.save({
      session: this.state.session,
      name: name || '(Untitled)'
    })
  }

  save({ session, name }) {
    const chats = JSON.parse(localStorage.chats || '[]').filter(x => x.id !== this.state.id);
    const newChat = {
      id: this.state.id,
      session: session,
      date: new Date,
      name: name,
      allowDelete: this.state.allowDelete
    };
    chats.unshift(newChat);
    localStorage.chats = JSON.stringify(chats);

    this.setState({ session, name });
  }

  run() {
    const session = this.state.session;
    const input = this.state.text;
    try {
      const output = this.vm.newExecution(input);
      this.save({ 
        session: [
          ...session, 
          { type: 'input', text: input },
          { type: 'debug', text: JSON.stringify(this.vm.stack.map(x => x.toString())) },
          ...(output ? [{ type: 'output', text: output }] : [])
        ],
        name: this.state.name
      });
      this.setState({ text: '' });
    } catch (e) {
      console.error(e);
      this.save({ 
        session: [
          ...session,
          { type: 'input', text: input },
          { type: 'debug', text: JSON.stringify(this.vm.stack.map(x => x.toString())) },
          { type: 'error', text: `${e.name}: ${e.message}` }
        ],
        name: this.state.name
      });
      this.setState({ text: '' });
    }
  }

  toHome() {
    this.controller.toHome();
  }

  remove() {
    const chats = JSON.parse(localStorage.chats || '[]').filter(x => x.id !== this.state.id);
    localStorage.chats = JSON.stringify(chats);
    this.controller.toHome();
  }

  render() {
    return (
      <div className="app-container">
        <div className="heading">
          <button className="back" onClick={ () => this.toHome() }>◀</button>
          <h1>
            <EditInline 
              paramName="name"
              change={ (e) => this.updateName(e) }
              text={ this.state.name }
            />
          </h1>
          { this.state.allowDelete ? <button className="right" onClick={ () => this.remove() }>❌</button> : null }
        </div>
        <div className="main-panel chat-panel">
          <ListSession session={ this.state.session } />
          <div className="message">
            <input type="text" placeholder="Type a message" 
              onChange={ (ev) => this.handleInput(ev) }
              onKeyPress={ (ev) => this.handleKey(ev) }
              value={ this.state.text } />
            <button className="run" onClick={ () => this.run() }>▶</button>
          </div>
        </div>
      </div>
    );
  }
}


module.exports = Chat;

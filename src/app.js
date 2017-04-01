const React = require('react');
const { data, derivations } = require('folktale/core/adt');
const { Chat, Welcome } = require('./components');


const Mode = data('emoj:app:mode', {
  Welcome() {

  },

  Chat(chat) {
    return { chat };
  }
}).derive(
  derivations.equality,
  derivations.debugRepresentation
);


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: Mode.Welcome()
    };
  }

  toHome() {
    this.setState({ mode: Mode.Welcome() });
  }

  toChat(chat) {
    this.setState({ mode: Mode.Chat(chat) });
  }

  render() {
    return this.state.mode.matchWith({
      Welcome: () => <Welcome controller={ this } />,
      Chat: ({ chat }) => <Chat chat={ chat } controller={ this } />
    });
  }
}

module.exports = App;
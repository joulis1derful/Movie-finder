import Vue from 'vue'
import MessageComponent from './components/Message.vue'

const MessageConstructor = Vue.extend(MessageComponent);

const Message = function(options) {
  options = options || {}
  if (typeof options === 'string') {
    options = {
      message: options
    }
  }

  const instance = new MessageConstructor({
    data: options
  })
  instance.$mount()
  document.body.appendChild(instance.$el)
 
  return instance
};

export default Message;
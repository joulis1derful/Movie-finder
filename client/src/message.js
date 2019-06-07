import Vue from 'vue'
import MessageComponent from './components/Message.vue'

const MessageConstructor = Vue.extend(MessageComponent);

let instance

const Message = function(options) {
  options = options || {}
  if (typeof options === 'string') {
    options = {
      message: options
    }
  }

  instance = new MessageConstructor({
    data: options
  })
  instance.$mount()
  document.body.appendChild(instance.$el)
 
  instance.visible = true
  return instance
};

['success', 'warning', 'info', 'error'].forEach(type => {
  Message[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    options.type = type
    return Message(options)
  }
})

export default Message;
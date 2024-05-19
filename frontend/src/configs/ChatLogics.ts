export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33
  if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0
  return 'auto'
}

export const isSameSender = (messages, m, i, userId) =>
  i < messages.length - 1 &&
  (messages[i + 1].sender._id !== m.sender._id ||
    messages[i + 1].sender._id === undefined) &&
  messages[i].sender._id !== userId

export const isLastMessage = (messages, i, userId) =>
  i === messages.length - 1 &&
  messages[messages.length - 1].sender._id !== userId &&
  messages[messages.length - 1].sender._id

export const isSameUser = (messages, m, i) =>
  i > 0 && messages[i - 1].sender._id === m.sender._id

export const getSender = (loggedUser, users) =>
  users[0]._id === loggedUser._id
    ? `${users[1].firstName} ${users[1].lastName}`
    : `${users[0].firstName} ${users[0].lastName}`

export const getSenderFull = (loggedUser, users) =>
  users[0]._id === loggedUser._id ? users[1] : users[0]

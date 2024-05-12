import mongoose, { Schema as MongooseSchema } from 'mongoose'

export default interface IChat {
  _id: mongoose.Schema.Types.ObjectId
  chatName: string
  isGroupChat: boolean
  users: mongoose.Schema.Types.ObjectId[]
  latestMessage: mongoose.Schema.Types.ObjectId
  groupAdmin: mongoose.Schema.Types.ObjectId
}

const { Schema } = mongoose

const chatSchema: MongooseSchema = new Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
)

const Chat = mongoose.model<IChat>('Chat', chatSchema)
export { IChat, Chat }

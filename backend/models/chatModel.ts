import mongoose, { Schema as MongooseSchema } from 'mongoose'

export default interface IChat {
  _id: string
  chatName: string
  isGroupChat: boolean
  users: string[]
  latestMessage: string
  groupAdmin: string
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
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
)

const Chat = mongoose.model<IChat>('Chat', chatSchema)
export { IChat, Chat }

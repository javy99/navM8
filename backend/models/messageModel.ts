import mongoose, { Schema as MongooseSchema } from 'mongoose'

export default interface IMessage {
  _id: mongoose.Schema.Types.ObjectId
  sender: mongoose.Schema.Types.ObjectId
  content: string
  chat: mongoose.Schema.Types.ObjectId
}

const { Schema } = mongoose

const messageSchema: MongooseSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
    },
  },
  {
    timestamps: true,
  },
)

const Message = mongoose.model<IMessage>('Message', messageSchema)
export { IMessage, Message }

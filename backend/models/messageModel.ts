import mongoose, { Schema as MongooseSchema } from 'mongoose'

export default interface IMessage {
  _id: string
  sender: string
  content: string
  chat: string
}

const { Schema } = mongoose

const messageSchema: MongooseSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
      trim: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
    },
  },
  {
    timestamps: true,
  },
)

const Message = mongoose.model<IMessage>('Message', messageSchema)
export { IMessage, Message }

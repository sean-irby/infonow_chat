import { Socket } from "socket.io";
import { MessageUtils } from "../../app/services/message";
import { Logger } from "../../sequelize/utils/logger";
import { PreviousMessageData } from "../models";
import { IOEvents } from "./index";

export async function OnGetPreviousMessages(
	socket: Socket,
	data: PreviousMessageData
) {
	try {
		console.log(IOEvents.GET_PREVIOUS_MESSAGES);

		let chatId = socket.roomsJoined[data.chatId];
		if (!chatId) throw "chatId not joined";

		let messages = await MessageUtils.getChatMessagesByChatId(
			chatId,
			data.dateTime
		);

		socket.emit(IOEvents.GET_PREVIOUS_MESSAGES, {
			chatId: data.chatId,
			data: messages,
			success: true,
		});
	} catch (error) {
		Logger.error(error);
		socket.emit(IOEvents.GET_PREVIOUS_MESSAGES, {
			chatId: data.chatId,
			success: false,
			error: error,
		});
	}
}

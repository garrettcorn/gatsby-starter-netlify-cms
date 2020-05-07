package handle

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	text := fmt.Sprintf("user_email:\n%v\n\nuser_message:\n%v\n\nRemoteAddr:\n%v", r.FormValue("user_email"), r.FormValue("user_message"), r.FormValue("user_remote_addr"))
	sendTelegramMsg(text)
}

func envVariables() (apiKey string, chatID int64) {
	chatID, err := strconv.ParseInt(os.Getenv("TELEGRAMCHATID"), 10, 64)
	if err != nil {
		log.Panic(err)
	}
	return os.Getenv("TELEGRAMAPI"), chatID
}

func sendTelegramMsg(text string) {
	apiKey, chatID := envVariables()
	bot, err := tgbotapi.NewBotAPI(apiKey)
	if err != nil {
		log.Panic(err)
	}

	msg := tgbotapi.NewMessage(chatID, text)

	bot.Send(msg)
}

/datum/plug13_connection
	var/is_connected = FALSE
	var/pending = FALSE
	var/error
	var/username
	var/code
	var/emote_sends_failed = 0
	var/client/owner

/datum/plug13_connection/New(client/owner)
	if (!owner)
		CRASH("Plug13 connection was created without an owner!")
	src.owner = owner

/datum/plug13_connection/proc/connect()
	if (is_connected || !code || pending) return
	if (!owner) return

	pending = TRUE
	error = ""

	var/body = list(
		"code" = code,
		"secret" = CONFIG_GET(string/plug13_secret),
		"key" = owner.key
	)

	var/datum/http_request/request = new
	request.prepare(RUSTG_HTTP_METHOD_POST, "[CONFIG_GET(string/plug13_url)]/api/game/connect", json_encode(body))
	request.begin_async()
	UNTIL(request.is_complete() || !owner)
	if (!owner) return

	var/datum/http_response/response = request.into_response()
	pending = FALSE

	if (response.errored || response.status_code != 200)
		error = "Ошибка соединения с Plug13"
		return

	var/data = json_decode(response.body)

	if (data["error"])
		error = data["error"]
		return

	is_connected = TRUE
	username = data["username"]


/datum/plug13_connection/proc/disconnect()
	is_connected = FALSE
	emote_sends_failed = 0
	username = null

/datum/plug13_connection/proc/send_emote(emote)
	if (!is_connected || !code) return
	if (!owner) return

	switch(emote)
		if ("front", "back", "face", "basic")
		else
			CRASH("Tried to send invalid Plug13 emote")

	var/body = list(
		"code" = code,
		"secret" = CONFIG_GET(string/plug13_secret),
		"key" = owner.key,
		"emote" = emote
	)

	var/datum/http_request/request = new
	request.prepare(RUSTG_HTTP_METHOD_POST, "[CONFIG_GET(string/plug13_url)]/api/game/emote", json_encode(body))
	request.begin_async()
	UNTIL(request.is_complete() || !owner)
	if (!owner) return

	var/datum/http_response/response = request.into_response()

	if (response.errored || FLOOR(response.status_code/100) != 2) // 2xx codes
		if (++emote_sends_failed > 10)
			error = "Слишком много неудачных запросов"
			disconnect()
		return

	emote_sends_failed = 0

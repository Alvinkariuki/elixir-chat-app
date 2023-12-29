// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// Bring in Phoenix channels client library:
import { Socket } from "phoenix";

// And connect to the path in "lib/chat_app_web/endpoint.ex". We pass the
// token for authentication. Read below how it should be used.
let socket = new Socket("/socket", { params: { token: window.userToken } });
let channel = socket.channel("room:lobby", {});
let chatInput = document.querySelector("#chat-input");
let messagesContainer = document.querySelector("#messages");
let messageMarkup = (payload) => {
  return `
  <div class="flex items-end">
    <div class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
      <div>
        <span class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-200 text-gray-600">
          ${payload.body}
        </span>
      </div>
    </div>

    <img
      src="https://avatars.githubusercontent.com/u/3?v=4"
      alt="My profile"
      class="w-6 h-6 rounded-full order-1"
    />
  </div>
  `;
};

chatInput.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    channel.push("new_msg", { body: chatInput.value });
    chatInput.value = "";
  }
});

channel.on("new_msg", (payload) => {
  let messageItem = document.createElement("div");
  messageItem.className = "chat-message";
  messageItem.innerHTML = messageMarkup(payload);
  messagesContainer.appendChild(messageItem);
});

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/chat_app_web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/chat_app_web/templates/layout/app.html.heex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/3" function
// in "lib/chat_app_web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket, _connect_info) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1_209_600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, connect to the socket:
socket.connect();

// Now that you are connected, you can join channels with a topic.
// Let's assume you have a channel with a topic named `room` and the
// subtopic is its id - in this case 42:

channel
  .join()
  .receive("ok", (resp) => {
    console.log("Joined successfully", resp);
  })
  .receive("error", (resp) => {
    console.log("Unable to join", resp);
  });

export default socket;

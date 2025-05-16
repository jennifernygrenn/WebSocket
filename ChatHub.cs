using ChatApp.DataService;
using ChatApp.Models;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace ChatApp.Hubs
{
    public class ChatHub : Hub
    {
        private readonly SharedDb _sharedDb;

        public ChatHub(SharedDb sharedDb)
        {
            _sharedDb = sharedDb;
        }

		// la till roll här
        public async Task JoinChatRoom(string role, string userName, string chatRoom)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, chatRoom);
            _sharedDb.Connection[Context.ConnectionId] = new UserConnection { UserName = userName, ChatRoom = chatRoom, ConnectionId = Context.ConnectionId, Role = role};

            await Clients.Group(chatRoom).SendAsync("ReceiveMessage", "admin", $"{userName} has joined the chat room {chatRoom}");
        }

		// la till två villkor här så ej student kan skicka i fel rum
        public async Task SendMessage(string chatRoom, string role, string userName, string message)
        {
			if (role == "Teacher" && chatRoom == "Announcements"){
            	await Clients.Group(chatRoom).SendAsync("ReceiveMessage", role, userName, message);
			} else if (chatRoom == "General") {
				await Clients.Group(chatRoom).SendAsync("ReceiveMessage", role, userName, message);
			}
        }

		// ny funktion som tar bort en användare
		public async Task LeaveChatRoom(string userName, string chatRoom)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, chatRoom);
            _sharedDb.Connection.TryRemove(Context.ConnectionId, out _);

            await Clients.Group(chatRoom).SendAsync("ReceiveMessage", "admin", $"{userName} has left the chat room {chatRoom}");
        }

		// ny funktion som kollar om någon disconnectar genom att kolla value för connectionen
		public override async Task OnDisconnectedAsync(Exception? exception)
		{
			var connection = _sharedDb.Connection.FirstOrDefault(c => c.Value.ConnectionId == Context.ConnectionId);
			if (connection.Value != null)
			{
				var userName = connection.Value.UserName;
				var chatRoom = connection.Value.ChatRoom;
				await LeaveChatRoom(userName, chatRoom);
			}
			await base.OnDisconnectedAsync(exception);
		}
    }
}
namespace ChatApp.Models
{
    public class UserConnection
    {
        public string UserName { get; set; } = string.Empty;
        public string ChatRoom { get; set; } = string.Empty;
		public string ConnectionId {get; set;} = string.Empty;
		public string Role {get; set;} = string.Empty;
    }
}
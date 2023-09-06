defmodule ChatAppWeb.ChatsLive.Index do
  use ChatAppWeb, :live_view

  def mount(param, session, socket) do
    IO.inspect(param)
    IO.inspect(session)

    {:ok, socket}
  end
end

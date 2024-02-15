defmodule ExampleWeb.PageController do
  use ExampleWeb, :controller

  def embedded(conn, _params) do
    render(conn, :embedded, counter: 1, layout: false)
  end

  def home(conn, _params) do
    render(conn, :home, layout: false)
  end
end

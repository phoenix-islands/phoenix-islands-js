defmodule ExampleWeb.PageHTML do
  use ExampleWeb, :html
  import PhoenixIslands

  embed_templates("page_html/*")
end

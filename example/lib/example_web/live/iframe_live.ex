defmodule ExampleWeb.IFrameIslandsLive do
  use ExampleWeb, :live_view_embedded
  import PhoenixIslands

  def render(assigns) do
    ~H"""
    <div class="p-4">
      <div class="mx-auto max-w-xl lg:mx-0 flex flex-col gap-4">
        <p class="text-[1.2rem] font-semibold leading-10 tracking-tighter text-zinc-900">
          Live iframe inside dead-view: React Island
        </p>
        <.island id="1" type={:react} component="ReactCounter" data={%{"counter" => @counter}}>
          <div class="w-full flex flex-row gap-3 items-center justify-between">
            <span>Server State: <%= @counter %></span>
            <button
              class="phx-submit-loading:opacity-75 rounded-lg bg-zinc-900 hover:bg-zinc-700 py-2 px-3 text-sm font-semibold leading-6 text-white active:text-white/80"
              phx-click="update_counter"
              phx-value-counter={@counter - 1}
            >
              LiveView -1
            </button>
          </div>
        </.island>

        <div class="hidden" />

        <.island id="2" type={:react} component="ReactSharedCounter">
          <div class="w-full flex flex-row gap-3 items-center justify-between">
            <span>Server State: <%= @counter %></span>
            <button
              class="phx-submit-loading:opacity-75 rounded-lg bg-zinc-900 hover:bg-zinc-700 py-2 px-3 text-sm font-semibold leading-6 text-white active:text-white/80"
              phx-click="update_counter"
              phx-value-counter={@counter - 1}
            >
              LiveView -1
            </button>
          </div>
        </.island>
        <.island
          id="3"
          type={:data}
          data={%{"counter" => @counter}}
          component="Logger"
          global_store_key="counterData"
        />
      </div>
    </div>
    """
  end

  def mount(_params, _session, socket) do
    {:ok, assign(socket, :counter, 1)}
  end

  def handle_event("update_counter", %{"counter" => counter}, socket) do
    {:noreply,
     assign(
       socket,
       :counter,
       if(is_binary(counter), do: String.to_integer(counter), else: counter)
     )}
  end
end

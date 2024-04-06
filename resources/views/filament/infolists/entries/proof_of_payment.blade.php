<x-dynamic-component :component="$getEntryWrapperView()" :entry="$entry">
    @foreach (\Illuminate\Support\Arr::wrap($getState()) as $key => $state)
    <x-filament::modal width="4xl">
        <x-slot name="trigger">
            <x-filament::button>
                Lihat
            </x-filament::button>
        </x-slot>

        {{-- Modal content --}}
        <x-slot name="heading">
            Bukti Pembayaran Pendaftaran
        </x-slot>
        <x-slot name="footer">
            <img src="{{ \Illuminate\Support\Str::remove('public/', asset('storage/' . $state)) }}" />
        </x-slot>
    </x-filament::modal>
    @endforeach
</x-dynamic-component>

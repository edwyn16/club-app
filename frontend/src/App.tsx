const App = () => {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
            <section className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
                <div className="h-2 bg-blue-700" />

                <div className="px-6 py-10 sm:px-10 sm:py-14">
                    <div className="mb-8 inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                        Development environment ready
                    </div>

                    <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                        Club LMS SaaS
                    </h1>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                        The React, TypeScript, Vite, and Tailwind CSS foundation is
                        successfully running.
                    </p>

                    <div className="mt-10 grid gap-4 sm:grid-cols-3">
                        <StatusCard label="Frontend" value="React + TypeScript" />
                        <StatusCard label="Build tool" value="Vite" />
                        <StatusCard label="Styling" value="Tailwind CSS" />
                    </div>
                </div>
            </section>
        </main>
    );
}

type StatusCardProps = {
    label: string;
    value: string;
};

const StatusCard = ({ label, value }: StatusCardProps) => {
    return (
        <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 font-semibold text-slate-900">{value}</p>
        </article>
    );
}

export default App;
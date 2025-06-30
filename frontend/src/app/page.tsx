import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-2xl mx-auto mt-16 p-8 bg-white rounded shadow text-center">
      <h1 className="text-4xl font-bold mb-4">Skill Share Marketplace</h1>
      <p className="mb-6 text-lg text-gray-700">
        Connect with skilled providers, discover new opportunities, and manage
        your tasks all in one place.
      </p>
      <div className="flex flex-col gap-4 items-center">
        <Link
          href="/auth/signup"
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          Sing Up
        </Link>
      </div>
    </main>
  );
}

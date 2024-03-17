import Link from "next/link";

export default function Home() {

  return (
    <div className="p-12 text-3xl">
      go to admin page{" "}
      <span className="underline">
        <Link href="/admin">here</Link>
      </span>
    </div>
  );
}

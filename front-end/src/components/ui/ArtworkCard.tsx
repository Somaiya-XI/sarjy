import { Artwork } from '@/types/artwork';
import Image from 'next/image';

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  return (
    <div className="w-full max-w-lg overflow-hidden items-center justify-center">
      {artwork.image_url ? (
        <Image
          src={artwork.image_url}
          alt={artwork.title ?? 'Artwork'}
          width={600}
          height={400}
          className="w-auto max-h-120  rounded-lg shadow-md"
          unoptimized
        />
      ) : (
        <div className="flex aspect-4/3 items-center justify-center text-sm opacity-50">
          Image unavailable
        </div>
      )}
<div className="min-w-0 space-y-1 p-4">
  <p className="line-clamp-2  xs:line-clamp-none font-body font-light text-xl text-primary">
    {artwork.title ?? 'Untitled'}
  </p>

  {artwork.artist && (
    <p className="line-clamp-1 xs:line-clamp-none text-sm opacity-70 text-[#847087]">
      {artwork.artist}
    </p>
  )}

  {artwork.date && (
    <p className="line-clamp-1 xs:line-clamp-none text-xs opacity-50">
      {artwork.date}
    </p>
  )}
</div>
    </div>
  );
}

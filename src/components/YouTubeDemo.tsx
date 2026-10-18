'use client';
import { useEffect, useRef, useState } from 'react';
/**
 * Click-to-load YouTube facade. Until the visitor clicks play, only a lazy-loaded thumbnail from i.ytimg.com is shown
 * (no YouTube player, scripts or cookies). On click it swaps in a privacy-enhanced youtube-nocookie.com iframe.
 * Without JS the play button is a plain link to the video on YouTube.
 */
export default function YouTubeDemo({ id, title, channel, toolName }: { id: string; title: string; channel: string; toolName: string }) {
  const [play, setPlay] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => { if (play) frame.current?.focus(); }, [play]);
  const watch = `https://www.youtube.com/watch?v=${id}`;
  const label = `Play video: ${title} (official ${toolName} demo by ${channel}, loads from YouTube)`;
  return (<figure className="m-0">
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-navy/10 dark:border-navy-700 bg-navy-950">
      {play
        ? <iframe ref={frame} src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title={`${title} (YouTube video)`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin" allowFullScreen className="absolute inset-0 h-full w-full border-0" />
        : <a href={watch} onClick={e => { e.preventDefault(); setPlay(true); }} aria-label={label} title={title}
            className="group absolute inset-0 block focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-coral">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" width={480} height={360} loading="lazy" decoding="async"
              referrerPolicy="no-referrer" className="h-full w-full object-cover" />
            <span aria-hidden="true" className="absolute inset-0 grid place-items-center bg-black/10 transition-colors group-hover:bg-black/25">
              <svg viewBox="0 0 68 48" className="h-12 w-[4.25rem] drop-shadow-lg"><path d="M66.5 7.7a8.5 8.5 0 0 0-6-6C55.2.3 34 .3 34 .3s-21.2 0-26.5 1.4a8.5 8.5 0 0 0-6 6C.1 13 .1 24 .1 24s0 11 1.4 16.3a8.5 8.5 0 0 0 6 6C12.8 47.7 34 47.7 34 47.7s21.2 0 26.5-1.4a8.5 8.5 0 0 0 6-6C67.9 35 67.9 24 67.9 24s0-11-1.4-16.3z" className="fill-[#212121] opacity-80 transition-[fill,opacity] group-hover:fill-[#f00] group-hover:opacity-100" /><path d="M45 24 27 14v20z" fill="#fff" /></svg>
            </span>
          </a>}
    </div>
    <figcaption className="mt-2 text-xs text-slate-600 dark:text-slate-400">
      <a className="link" href={watch} target="_blank" rel="noopener">Official demo by {channel} on YouTube</a>: “{title}”
    </figcaption>
  </figure>);
}

export const Header = () => (
  <div className="flex">
    <div id="header" className="font-header basis-full">
      <a href="/" className="mx-auto">
        <h1 className="title font-bold">Daily Bread</h1>
      </a>
      <p className="text-center">It is only a paper moon</p>
      <div className="link">
        <p>
          <a href="/rss.xml" target="_blank" rel="noopener noreferrer">
            rss
          </a>
        </p>
        <p>
          <a href="/calendar" target="_blank" rel="noopener noreferrer">
            calendar
          </a>
        </p>
      </div>
    </div>
  </div>
);

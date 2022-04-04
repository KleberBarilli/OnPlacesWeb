import * as React from 'react';

function CityInfo(props) {
  const { info } = props;
  const displayName = `${info.name}`;

  return (
    <div>
      <div>
        {displayName} |{' '}
        <a
          target="_new"
          href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${displayName}`}
        >
          aa
        </a>
      </div>

      <img width={250} src={`${process.env.REACT_APP_S3_URL}/${info.image}`} alt="img-city" />
    </div>
  );
}

export default React.memo(CityInfo);

import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Winnie Kwon',
    imgurl: require('@site/static/img/winnie.jpeg').default,
    description: (
      <>
        Engineering Manager @ VMWare
      </>
    ),
  },
  {
    title: 'Richard Case',
    imgurl: require('@site/static/img/richard.png').default,
    description: (
      <>
        Principal Engineer @ SUSE
      </>
    ),
  },
  {
    title: 'Anusha Hegde',
    imgurl: require('@site/static/img/anusha.jpg').default,
    description: (
      <>
        Technical Product Manager @ Nirmata
      </>
    ),
  },
  {
    title: 'Avishay Traeger',
    imgurl: require('@site/static/img/avishay.jpg').default,
    description: (
      <>
        Senior Principal Software Engineer @ Redhat
      </>
    ),
  },
];

function Feature({imgurl, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={imgurl} height="200" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

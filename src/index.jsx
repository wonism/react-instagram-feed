import React, { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import fp from 'lodash/fp';
import {
  BASE_URL,
  POPULAR,
  TAGS,
  LOCATION,
  USER,
  RESOLUTION_STANDARD,
  RESOLUTION_LOW,
  RESOLUTION_THUMBNAIL,
  FULL_RESOLUTION_PROPERTY,
  TARGET_BLANK,
  TARGET_SELF,
  getPathname,
} from './constants';

export default class Feed extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    accessToken: PropTypes.string.isRequired,
    count: PropTypes.number,
    type: PropTypes.oneOf([POPULAR, TAGS, LOCATION, USER]),
    param: PropTypes.string,
    resolution: PropTypes.oneOf([
      RESOLUTION_STANDARD,
      RESOLUTION_LOW,
      RESOLUTION_THUMBNAIL,
    ]),
    wrapper: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    hasLink: PropTypes.bool,
    linkTarget: PropTypes.oneOf([TARGET_BLANK, TARGET_SELF]),
    showButton: PropTypes.bool,
    buttonText: PropTypes.string,
    before: PropTypes.func,
    after: PropTypes.func,
    forceNext: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.bool,
      PropTypes.func,
      PropTypes.number,
      PropTypes.object,
      PropTypes.string,
      PropTypes.symbol,
    ]),
  };

  static defaultProps = {
    className: '',
    count: 20,
    type: USER,
    param: null,
    resolution: RESOLUTION_LOW,
    wrapper: null,
    hasLink: false,
    linkTarget: TARGET_BLANK,
    showButton: true,
    buttonText: 'Fetch Feeds',
    before: () => {},
    after: () => {},
    forceNext: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      error: null,
      nextUrl: null,
    };

    this.url = this.generateUrl(this.props.type);

    global.fetchInstagram = (res) => {
      const { meta } = res;
      const { code, error_message: error } = meta;

      if (code !== 200) {
        this.setState({
          error,
        });
      } else {
        const { data, pagination } = res;
        const nextUrl = fp.flow(
          fp.defaultTo({}),
          fp.get('next_url'),
          fp.defaultTo(null),
        )(pagination);

        if (fp.size(data) === 0) {
          this.setState({
            error: 'No images',
          });
        } else {
          this.props.after();

          const images = update(this.state.images, {
            $push: data,
          });

          this.setState({
            images,
            nextUrl,
          });
        }
      }
    };
  }

  componentDidMount() {
    this.addScript();
  }

  componentDidUpdate(prevProps) {
    if ((this.props.forceNext !== prevProps.forceNext) && this.state.nextUrl) {
      this.addScript(this.state.nextUrl);
    }
  }

  addScript = (url) => {
    this.props.before();

    ((d, s, id) => {
      const oldScript = d.getElementById(id);

      if (oldScript) {
        oldScript.remove();
      }

      const element = d.getElementsByTagName(s)[0];
      const fjs = element;
      let js = element;

      js = d.createElement(s);
      js.id = id;
      js.src = url || this.url;
      fjs.parentNode.insertBefore(js, fjs);
    })(global.document, 'script', 'ig-jsonp');
  };

  addToken = fp.add(
    fp.__,
    `?access_token=${this.props.accessToken}`
  );

  generateUrl = fp.flow(
    fp.defaultTo('user'),
    fp.get(fp.__, getPathname),
    getter => getter(this.props.param),
    fp.add(BASE_URL),
    this.addToken,
    fp.add(fp.__, `&count=${this.props.count}`),
    fp.add(fp.__, '&callback=fetchInstagram')
  );

  render() {
    const {
      className,
      resolution,
      wrapper,
      showButton,
      buttonText,
      hasLink,
      linkTarget,
    } = this.props;

    const Wrapper = typeof wrapper === 'function' ? wrapper : null;
    const properties = fp.flow(
      prop => (
        fp.isNil(linkTarget) ?
          prop :
          fp.set('target', linkTarget)(prop)
      ),
      prop => (
        linkTarget === TARGET_BLANK ?
          fp.set('rel', 'noopener noreferrer')(prop) :
          prop
      )
    )({});

    return (
      <div className={className}>
        {this.state.error ? (
          <p className="igf-error">
            {this.state.error}
          </p>
        ) : null}
        {fp.map((image) => {
          // TODO 1: make carousel with carousel_media if type was carousel
          // TODO 2: make video if type was video
          const imageWrapper = createElement(
            hasLink ? 'a' : 'span',
            hasLink ?
              fp.flow(
                fp.set('href', fp.get('link')(image)),
                fp.set('key', fp.get('id')(image))
              )(properties) :
              fp.set('key', fp.get('id')(image))(properties),
            [
              <img
                key="image"
                className="igf-image"
                src={fp.get(`images.${FULL_RESOLUTION_PROPERTY[resolution]}.url`)(image)}
                alt={fp.get('id')(image)}
              />,
              <span
                key="like"
                className="igf-like"
              >
                <i className="fa fa-heart" />
                {fp.get('likes.count')(image)}
              </span>,
              <span
                key="comment"
                className="igf-comment"
              >
                <i className="fa fa-comment" />
                {fp.get('comments.count')(image)}
              </span>,
              <blockquote key="caption" className="igf-caption">
                {fp.get('caption.text')(image)}
              </blockquote>,
            ]
          );

          if (fp.isNil(Wrapper)) {
            return imageWrapper;
          }

          return (
            <Wrapper key={fp.get('id')(image)}>
              {imageWrapper}
            </Wrapper>
          );
        })(this.state.images)}
        {showButton && this.state.nextUrl ? (
          <button className="igf-next-button" onClick={() => { this.addScript(this.state.nextUrl); }}>
            {buttonText}
          </button>
        ) : null}
      </div>
    );
  }
}

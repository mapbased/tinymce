import { Arr } from '@ephox/katamari';
import { Future } from '@ephox/katamari';
import { Futures } from '@ephox/katamari';
import { Css } from '@ephox/sugar';
import IosScrolling from '../scroll/IosScrolling';
import IosViewport from './IosViewport';

const updateFixed = function (element, property, winY, offsetY) {
  const destination = winY + offsetY;
  Css.set(element, property, destination + 'px');
  return Future.pure(offsetY);
};

const updateScrollingFixed = function (element, winY, offsetY) {
  const destTop = winY + offsetY;
  const oldProp = Css.getRaw(element, 'top').getOr(offsetY);
  // While we are changing top, aim to scroll by the same amount to keep the cursor in the same location.
  const delta = destTop - parseInt(oldProp, 10);
  const destScroll = element.dom().scrollTop + delta;
  return IosScrolling.moveScrollAndTop(element, destScroll, destTop);
};

const updateFixture = function (fixture, winY) {
  return fixture.fold(function (element, property, offsetY) {
    return updateFixed(element, property, winY, offsetY);
  }, function (element, offsetY) {
    return updateScrollingFixed(element, winY, offsetY);
  });
};

const updatePositions = function (container, winY) {
  const fixtures = IosViewport.findFixtures(container);
  const updates = Arr.map(fixtures, function (fixture) {
    return updateFixture(fixture, winY);
  });
  return Futures.par(updates);
};

export default {
  updatePositions
};
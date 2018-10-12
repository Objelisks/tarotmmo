/* globals Set */

// useful utils for dealing with world/object/network state

/*

ids: uuid set by creator and agreed on by everyone else
each player owns a set of objects. if they leave, it gets pushed into unowned (won't be updated)

state looks like:
{
  [playerId]: [{
    id: playerId,
    objects: {
      [objectId]: {
        id: objectId,
        pos: [x, y, z],
        rot: [x, y, z, w]
      }
    },
    events: {
      [eventId]: {
        id: eventId,
        start: date,
        dur: number
      },
    }
  }],
  ...
}

network packets are:
{
  [playerId]: state,
  ...
}

*/

export const isNotVeryOld = (event) => (event.start - Date.now()) < ((event.dur || 1) + 5)

export const projectIntoFuture = (obj, delta) => obj;

export const weightedObject = (a, b, aw, bw) => {
  return (!a && b) ? b :
    (a && !b) ? a :
    ({
      pos: (aw * a.pos + bw * b.pos) / (aw + bw),
      rot: (aw * a.rot + bw * b.rot) / (aw + bw)
    });
}

const cleanEvents = (events) => Object.values(events)
  .filter(event => isNotVeryOld(event))
  .reduce((pre, event) => ({...pre, [event.id]: event}), {})

console.log({
  now: Date.now(),
  1: cleanEvents({}),
  2: cleanEvents({1: {id: 1, start: Date.now(), dur: 1}}),
  3: cleanEvents({1: {id: 1, start: Date.now(), dur: 1}, 2: {id: 2, start: Date.now()+20, dur: 1}}),
});


export const combineState = (stateA, stateB) => {
  console.log('combine', stateA, stateB);
  return (stateA && !stateB) ? stateA :
    (!stateA && stateB) ? stateB :
    ({
      objects: Object.values(stateA.objects)
        .map(obj => projectIntoFuture(obj))
        .map(obj => weightedObject(obj, stateB.objects[obj.id], (stateA.weight || 1), (stateB.weight || 1)))
        .reduce((pre, cur) => ({...pre, [cur.id]: cur}), {}),
      events: {...cleanEvents(stateA.events), ...cleanEvents(stateB.events)},
      weight: (stateA.weight || 1) + (stateB.weight || 1),
    });
}

const s = (start, end) => (start+end)*(end-start)/2;
export const flattenHistory = (arr) => 
  Object.assign(
    arr
      .map((state, i) => ({...state, weight: 1}))
      .reduce((pre, state) => combineState(pre, state)),
    {weight: 1})

export const combinePackets = (packets) => 
  Object.values(packets)
    .map(history => flattenHistory(history))
    .reduce((pre, networkState) => combineState(pre, networkState));

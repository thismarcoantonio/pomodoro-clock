import { Selector, ClientFunction } from "testcafe";

fixture("Pomodoro clock").page("http://localhost:3000/");

const setAppTimings = ClientFunction(({ breakTime, workTime } = {}) => {
  window.BREAK_TIME = breakTime || window.BREAK_TIME;
  window.WORKING_TIME = workTime || window.WORKING_TIME;
  return window.boostrap();
});

test("Renders initial state correctly", async (t) => {
  await setAppTimings();

  const timer = await Selector("#timer");
  await t.expect(timer.innerText).eql("30:00");

  const sessions = await Selector("#session");
  await t.expect(sessions.nth(0).hasClass("active")).eql(true);
  await t.expect(sessions.nth(1).hasClass("active")).eql(false);

  const mode = await Selector("#mode");
  await t.expect(mode.innerText).eql("work");
});

test("Renders break time after 1 second", async (t) => {
  await setAppTimings({ workTime: 1000 });

  const playButton = await Selector("#actionButton");
  await t.click(playButton).wait(1000);

  const sessions = await Selector("#session");
  await t.expect(sessions.nth(0).hasClass("completed")).eql(true);
  await t.expect(sessions.nth(1).hasClass("active")).eql(true);
  await t.expect(sessions.nth(2).hasClass("active")).eql(false);

  const mode = await Selector("#mode");
  await t.expect(mode.innerText).eql("break");
});

test("Stop button resets the application", async (t) => {
  await setAppTimings({ workTime: 1000 });

  const playButton = await Selector("#actionButton");
  await t.click(playButton).wait(1000);

  const timer = await Selector("#timer");
  const sessions = await Selector("#session");
  const mode = await Selector("#mode");

  await t.expect(timer.innerText).notEql("30:00");
  await t.expect(sessions.nth(0).hasClass("completed")).eql(true);
  await t.expect(mode.innerText).eql("break");

  const stopButton = await Selector("#stopButton");
  await t.click(stopButton);

  await t.expect(timer.innerText).eql("00:01");
  await t.expect(sessions.nth(0).hasClass("completed")).eql(false);
  await t.expect(mode.innerText).eql("work");
});

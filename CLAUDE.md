## Testing Workflow
- Every time you complete a task, to verify the application is working, rebuild the docker container, stop and remove the current container if its running, then use puppeteer to open the application from the container, take screenshots to verify the changes, then play a game to completion, and take a screenshot of the winner.  if you can't play a game to completion or see the requested changes, fix the application until you can.  do not run docker stop and docker rm on the container when you are done.  leave the application running in the container so i can validate.
- All changes should be responsive, and display properly on a cell phone screen, tablet, and computer monitor
- Never push to github without me explicitly telling you to.
- Make sure you're putting all screenshots in the Screenshots directory
- Every time you start a new task, clear out the screenshots directory before starting

## Communication Shortcuts
- Whenever I say "ship it", that means push the changes to github.
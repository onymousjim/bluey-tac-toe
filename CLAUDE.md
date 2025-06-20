## Testing Workflow
- Cleanup any test containers from previous runs
- Every time you complete a task, to verify the application is working, rebuild the docker container, stop and remove the current container if its running, then use puppeteer to open the application from the container, take screenshots to verify the changes, then play a game to completion, and take a screenshot of the winner.  if you can't play a game to completion or see the requested changes, fix the application until you can.  
- Do not clean up the test container by runing docker stop and docker rm on the container when you are done testing.  leave the application running in the container so i can validate.
- All changes should be responsive, and display properly on a cell phone screen, tablet, and computer monitor
- IMPORTANT never git commit or push to github as part of your plan
- If the Screenshots directory doesn't exist, create it.  Make sure you're putting all screenshots in the Screenshots directory.  
- Every time you start a new task, clear out the screenshots directory before starting

## Communication Shortcuts
- Whenever I say "ship it", that means push the changes to github.
- Whenever I say "start it", that means ensure the container is rebuilt and running
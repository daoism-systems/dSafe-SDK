# ceramic

## Deploying composite locally

1. Run ceramic Daemon

   ```
   ceramic daemon
   ```

   This will start the ceramic daemon locally at localhost:7007

2. Create composite using
   ```
   yarn deploy --environment [dev|staging|prod] --private-key [value] [--ceramic-url [value]]
   ```

   To find more information about the command, run:
   ```
   yarn deploy [--help|-h]
   ```

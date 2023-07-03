# Heroku Deployment 

## Steps

  > Ensure you are in the ROOT folder.

  * Create a new empty application on Heroku.
  ```bash
    heroku create -a app-name-here
  ```

  * Verify a remote named 'heroku' has been created.
  ```bash
    git remote -v
  ```

  * Open the [MongoDB Atlas website](https://www.mongodb.com/cloud/atlas) and sign in to your account.

  * Select 'Database' from the left menu.

  * Click 'Connect' next to the Cluster you want to connect to.

  * Get the URL for the database.

  * Add the URL to the 'server/.env' file under the key: MONGODB_URI.

  * Build latest production files.
  ```bash
    npm run build
  ```

  * Commit your files to the repository.

  * Deploy to Heroku.
  ```bash
  git push heroku main
  ```
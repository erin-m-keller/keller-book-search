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

  * Build latest production files.
  ```bash
    npm run build
  ```

  * Deploy the application.
  ```bash
    git push heroku main
  ```
## Resource Planning Venue Booking Website Application Project

### Table of Contents
* [Project Background](README.md#project-background)
* [Prerequisites](README.md#prerequisites)
* [Deployment Instructions](README.md#deployment-instructions)
* [Important Points](README.md#deployment-instructions)
* [Developer](README.md#developer)

### Project Background
Defence Collective Singapore (DCS), previously known as Singapore Discovery Centre (SDC), is a non-profit government organization with a mission to educate and engage both Singapore citizens and visitors about the country's rich history, culture, and national identity. DCS aims to inspire future generations to contribute to Singapore's future by sharing Singapore Stories. They offer a wide range of educational programmes, interactive exhibitions, multimedia shows, guided tours, and workshops that cover various themes such as Total Defence Day and National Day. DCS’s key audiences are national service recruits, youths, families, schools, and corporates as their primary audience.

As of current, the Event Management & Planning Department faces challenges with their current booking confirmation process, which involves handling requests through emails and keeping track of them in an excel file. This is a concern as there is no backup in place which leads to potential data loss or corruption. 

To address these issues and increase productivity, this project was proposed and aims to automate the booking confirmation process and improve resource management. This helps to eliminate the need for managing multiple emails and the risk of losing important data. The web application will also centralize all booking requests and maintain a secure database for easy access and retrieval.

### Prerequisites
1. Ensure [NodeJS](https://nodejs.org/en) is installed and added to ENV Path.
2. Ensure [Git](https://git-scm.com/downloads) is installed and added to ENV Path.
3. Have LOCAL ENV file on hand, cannot be found in GitHub and should never be pushed to GitHub.
4. Download and install any IDE that can run ReactJS codes, [Visual Studio Code](https://code.visualstudio.com/download) is recommended.
5. Download and install [GitHub Desktop](https://desktop.github.com/) to clone repository.
   
### Deployment Instructions
1. Clone GitHub Repository using GitHub Desktop or by using CMD line.
2. Once Repository have been cloned, open the project file in your IDE
3. Copy LOCAL ENV file to the root folder in the file directory
4. Install the following and set up before deployment:
  * Step 1: Install all node modules used in the project by running > `npm install`
  * Step 2: Build the project by running > `npm run build`
  * Step 3: Login Firebase CLI by running > `firebase login` and you should be directed to your browser to login, else copy and paste the link to your browser. To confirm you logged in successfully run > `firebase` login again<br/><br/>
  * Step 4: Upon successful login, check that the file directory has all the required files:
    (* Take note that the env file will not be included in the file directory and needs to be added manually as mentioned.) <br/>
  * Step 5: If all require files are there, change directory to project folder and deploy the project by running > `firebase deploy -only hosting` on command prompt
  * Once finished, the project is deployed and ready for use! 

### Important Points:
1. Always build the project before deploying the project, else the deployed project will not be updated.
2. Never upload LOCAL ENV file to GitHub or a Shared Directory (Security Reasons)
3. When using command prompt, ensure to run as an administrator.

### Developers
Vanessa Ho Jingmei | [@VanessaHo99](https://github.com/VanessaHo99) 2023 <br>
Geethika | 2024


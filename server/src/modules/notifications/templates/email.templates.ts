export const welcomeJudgeEmailTemplate = (judge) => {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">Hi ${judge.firstname}! 👋</h1>
        
        <p>Thanks again for all your help and support as a Community Hero 🎉</p>
        
        <p>Your expertise and feedback to the community is so powerful we know it's going to help all us as a community (our community) shape the future powered with AI innovation! 🚀</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Quick access details:</h2>
          <ul style="list-style-type: none; padding-left: 0;">
            <li>• Community Platform: <a href="https://www.oxbridgeaix.uk/auth/join/FpgxiglF24EobWBinjkO2" style="color: #0066cc;">https://www.oxbridgeaix.uk/auth/join/FpgxiglF24EobWBinjkO2</a></li>
            <li>• Please join when you get the chance.</li>
            <li>• We encourage you to introduce yourself as well please via the Just In Page.</li>
          </ul>
        </div>
  
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #856404; margin-top: 0;">Important Note:</h2>
          <p>Currently we have two separate systems (MVP stage!):</p>
          <ol>
            <li>Platform account - create this first when you join</li>
            <li>Scoring system - the login details that you used to join here are separate login details but we're building SSO integration (coming soon!)
              <div style="padding-top: 20px;">
                <p>Your login credentials:</p>
                <p>Email: ${judge.email}<br>
                Password: ${judge.passwordToken}</p>
              </div>
            </li>
          </ol>
        </div>
  
        <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">What's next:</h2>
          <ol>
            <li>Check your assigned judging sessions</li>
            <li>Access judging materials & guidelines</li>
            <li>Join community events, discussions and connect with others via the platform</li>
          </ol>
        </div>
  
        <p>Any questions please reply here or contact Francisco Morejón or myself via the platform!</p>
        
        <p><strong>You've Got This and We've Got Your Back!</strong></p>
        
        <p>Cheers,<br>Udai</p>
        
        
      </div>
    `;
};

export const welcomeTeamEmailTemplate = (team) => {
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">Hey ${team.name}! 👋</h1>
        
        <p>Welcome to the community! 🎉</p>
        
        <p>Please check and confirm details for your upcoming pitch/pitches via the <a href="https://www.oxbridgeaix.uk" style="color: #0066cc;">www.oxbridgeaix.uk</a> platform.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Access Details:</h2>
          <p>In case you haven't signed up already, here's your Community Platform Invite Link:<br>
          <a href="https://www.oxbridgeaix.uk/auth/join/FpgxiglF24EobWBinjkO2" style="color: #0066cc;">https://www.oxbridgeaix.uk/auth/join/FpgxiglF24EobWBinjkO2</a></p>
        </div>
  
        <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Next Steps:</h2>
          <ol style="padding-left: 20px; margin-bottom: 0;">
            <li>Create platform profile</li>
            <li>Introduce yourself</li>
            <li>Don't forget to send the pitch decks by the required time</li>
            <li>Check schedule</li>
            <li>Join community discussions</li>
          </ol>
        </div>
  
        <p>Any questions please reply here or contact Francisco Morejón or myself via the platform!</p>
        
        <p style="font-weight: bold;">You've Got This and We've Got Your Back!</p>
        
        <p>Cheers,<br>Udai</p>
      </div>
    `;
};

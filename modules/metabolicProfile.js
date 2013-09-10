exports.init = function(profile) {
    //this properly private stuff.

    // private vars
    var logger = require('../modules/log');
    //var profile = req.session.profile;

    // make sure the guest is logged in
    if(profile) {
    // we don't need to run this everytime we load up the thefountains app
    // if we have the metabolicProfile and there are no errors then skip
      
      profileErrors(); 
      profileWarnings();

      //adjust profile 
      prepProfileIntegers();
      age();
      height();
      activityFactor();
      occupationalFactor();
      metabolicTargets();
      calculateBMI();
      exerciseBreakdownAdjustment();
      restingMetabolicRate();
      basalAdjustment();
      occupationalAdjustment();
      harrisonAdjustment();
      cardioAdjustment();
      // todo: periodicRateAdjustment();
      mealsPerDayAdjustment();
      alternateFiberThreshold();
      metabolicProfile();

    } 

    function profileErrors() {

      profile.errors = [];
      if(!profile.birthdayday || !profile.birthdaymonth || !profile.birthdayyear){
        profile.errors.push('The birthday day, month and year fields are required.');
      }
      if(!profile.gender){
        profile.errors.push('The gender field is required.');
      }
      if(!profile.weightlbs){
        profile.errors.push('The weightlbs field is required.');
      }
      if(!profile.height){
        profile.errors.push('The height field is required.');
      }
      if(!profile.waistinches){
        profile.errors.push('The waistinches field is required.');
      }
      if(!profile.occupation){
        profile.errors.push('The occupation field is required.');
      }
      if(!profile.goal){
        profile.errors.push('The goal field is required.');
      }
      if(!profile.exercise_regimen){
        profile.errors.push('The exercise regimin field is required.');
      }
      if(!profile.meals_per_day){
        profile.errors.push('The meals per day field is required.');
      }
      logger.log({level:3,msg:'profile errors ', obj:profile.errors});
    };

    function profileWarnings() {

      profile.warnings = [];
      if(profile.goal=='Gain Muscle and Weight, Ingore Body Fat') {
        logger.log({level:3,msg:'Gain Muscle and Weight, Ingore Body Fat Red Flag Check'});
        if (
            (profile.exercise_breakdown=='100% cardio') ||
            (profile.exercise_breakdown=='75% cardio and 25% weights') ||
            (profile.exercise_breakdown=='no exercise')
           ) 
        {
          var msg = 'You cannot effectively "' + profile.goal + '" while doing "' + profile.exercise_breakdown + '".';
          logger.log({level:3,msg:msg});
          profile.warnings.push({ warning: msg});
        }
      }
      if(profile.goal=='Gain Muscle and Maintain Body Fat/Bulk') {
        logger.log({level:3,msg:'Gain Muscle and Maintain Body Fat/Bulk Red Flag Check'});
        if (
            (profile.exercise_breakdown=='100% cardio') ||
            (profile.exercise_breakdown=='75% cardio and 25% weights') ||
            (profile.exercise_breakdown=='50% cardio and 50% weights') ||
            (profile.exercise_breakdown=='no exercise')
           ) 
        {
          var msg ='You cannot effectively "' + profile.goal + '" while doing "' + profile.exercise_breakdown + '".';
          logger.log({level:3,msg:msg});
          profile.warnings.push({ warning: msg});
        }
      }
      if(profile.goal=='Tone and Firm') {
        logger.log({level:3,msg:'Tone and Firm Red Flag Check'});
        if (
            (profile.exercise_breakdown=='100% cardio') ||
            (profile.exercise_breakdown=='no exercise')
           ) 
        {
          var msg ='You cannot effectively "' + profile.goal + '" while doing "' + profile.exercise_breakdown + '".';
          logger.log({level:3,msg:msg});
          profile.warnings.push({ warning: msg});
        }
      }
      if(profile.goal=='Maintain') {
        logger.log({level:3,msg:'Maintain Red Flag Check'});
        if (
            (profile.exercise_breakdown=='100% cardio') ||
            (profile.exercise_breakdown=='no exercise')
           ) 
        {
          var msg ='You cannot effectively "' + profile.goal + '" while doing "' + profile.exercise_breakdown + '".';
          logger.log({level:3,msg:msg});
          profile.warnings.push({ warning: msg});
        }
      }
      if(profile.goal=='Strengthen Muscle and Loose 10% Weight') {
        logger.log({level:3,msg:'Strengthen Muscle and Loose 10% Weight Red Flag Check'});
        if (
            (profile.exercise_breakdown=='100% cardio') ||
            (profile.exercise_breakdown=='no exercise')
           ) 
        {
          var msg ='You cannot effectively "' + profile.goal + '" while doing "' + profile.exercise_breakdown + '".';
          logger.log({level:3,msg:msg});
          profile.warnings.push({ warning: msg});
        }
      }
    };

    function prepProfileIntegers(){
      profile.heightfeet = parseInt(profile.heightfeet, 10);
      profile.heightinches = parseInt(profile.heightinches, 10);
      profile.weightlbs = parseInt(profile.weightlbs, 10);
      profile.waistinches = parseInt(profile.waistinches, 10);
      profile.meals_per_day = parseInt(profile.meals_per_day, 10);
    };
    /*
     * expects date string yyyy-mm-dd
     * returns age
     */
    function calcAge(dateString) {
      logger.log({level:3,msg:'calcAge ', obj:profile});
      var birthday = +new Date(dateString);
      return ~~((Date.now() - birthday) / (31557600000));
    };

    function age() {
        //if(profile.birthdayyear && profile.birthdayday && profile.birthdaymonth) {
          var dateString = profile.birthdayyear + "-" + profile.birthdaymonth + "-" + profile.birthdayday;
          profile.age = calcAge(dateString);
          logger.log({
            level:3,
            msg:'age '+profile.age
          });
        //}
    };

    function height() {
        //if(profile.heightfeet && profile.heightinches){

          profile.height  = profile.heightfeet * 12 + profile.heightinches;
          logger.log({
            level:3,
            msg:'height ' + profile.height
          });
        //}
    };

    function activityFactor() {
        //todo change string compare to key compare,
        //get keys from database and separate content from this method
        profile.activityFactor = 0;
        switch(profile.exercise_regimen) {
            case 'no exercise':
              profile.activityFactor = 1.00;
              break;
            case '1-3 hours per week':
              profile.activityFactor = 1.05;
              break;
            case '4-6 hours per week':
              profile.activityFactor = 1.10;
              break;
            case '7-9 hours per week':
              profile.activityFactor = 1.35;
              break;
            case '10-14 hours per week':
              profile.activityFactor = 1.65;
              break;
        }
        logger.log({
          level:3, 
          msg:'activity factor '+profile.activityFactor
        });
        //delete profile.exercise_regimen;
        return profile
    };

    function occupationalFactor() {
        //todo change string compare to key compare,
        //get keys from database and separate content from this method
        profile.occupationalFactor = 0;
        switch(profile.occupation) {
          case 'Sedentary (eg: Office Worker)':
            profile.occupationalFactor = .95;
            break;
          case 'Labor (eg: Waitress or Waiter)':
            profile.occupationalFactor = 1.00;
            break;
          case 'Heavy Labor (eg: Construction Worker)':
            profile.occupationalFactor = 1.10;
            break;
        }
      logger.log({
        level:3,
        msg:'occupation factor '+profile.occupationalFactor
      });
      return profile;
    };

    function metabolicTargetOverride() {
      //TODO: allow for this override
      strOverrideMessage = "These are the manual targets you've set. To turn off the manual override edit you're <a href=\"strSiteRoot/user/profileuid/edit/Metabolic%20Targets\">Metabolic Targets</a>.";
        harrisonFactor = 1; //ignore for override
        protein        =trim(profile.protein);
        carbs          =trim(profile.carbohydrates);
        fats           =trim(profile.fats);
        simpleCarbs    =trim(profile.simple_carbohydrates);
        fiberousCarbs  =trim(profile.fibers);
    };
    
    function metabolicTargets() {
      if(profile.metabolic_target_override){
        metabolicTargetOverride();
      } else {
        var goalTargetDefaults = require('../data/goalTargetDefaults').data;
        profile.metabolicTargets = goalTargetDefaults[profile.goal];
        profile.harrisonFactor = profile.metabolicTargets.goal_factor;
        logger.log({
          level:3,
          msg:'metabolic targets', obj:profile.metabolicTargets
        });

        if( profile.gender != 'Male' ){
          logger.log({
            level:3,
            msg:'male gender adjustment reducing fibers by -10'
          });
          profile.metabolicTargets.daily_fibers -= 10;
        }

        if(activityFactor >= 1.6) {
          if (( profile.goal == 'Gain Muscle and Maintain Body Fat/Bulk' ) || ( profile.goal == 'Tone and Firm' )) {
            logger.log({
              level:3,
              msg:'activityFactor >= 1.6 and goal is bulk or tone. adjusting meal breakdown proteins by -5 and carbs by +5'
            });
            profile.metabolicTargets.proteins_breakdown -= 5;
            profile.metabolicTargets.carbs_breakdown += 5;
          }
        }

        logger.log({level:3,msg:'metabolic targets',obj:profile.metabolicTargets});
      }
    };

    function calculateBMI() {
      profile.bmi = Math.round( 
        ( profile.weightlbs * 703 ) / ( profile.height * profile.height )
        ,1
      );
      profile.bmiObesityFlag = false;
      logger.log({ 
        level: 3, 
        msg: 'BMI or Waist Circumfrence Flag. Fitness Goal: '+profile.goal+' waist: intWaist bmi: bmi bmiObesityFlag='+profile.bmiObesityFlag,
        obj: profile
      });
      if(profile.bmiObesityFlag){
        profile.warnings.push('We stronly encourage you to select a Fitness Goal that contains "Loose 10% Weight".');
      } else {
        // members selected loose weight fitness goal, reset flag to false
        profile.bmiObesityFlag=false;
      }
    };

    function exerciseBreakdownAdjustment() {
      switch(profile.exercise_breakdown) {
        case '100% weights':
          logger.log({ 
            level: 3, 
            msg: 'Exercise Breakdown adjustment '+profile.exercise_breakdown+' protein +2.5 protein -2.5 carbs'
          });
          profile.protein += 2.5;
          profile.carbs   -= 2.5;
        break;
        case '25% cardio and 75% weights':
          logger.log({ 
            level: 3, 
            msg: 'Exercise Breakdown adjustment '+profile.exercise_breakdown+' protein +2 protein -2 carbs'
          });
          profile.protein += 2;
          profile.carbs   -= 2;
        break;
        case '75% cardio and 25% weights':
          logger.log({ 
            level: 3, 
            msg: 'Exercise Breakdown adjustment '+profile.exercise_breakdown+' protein -3.5 protein +3.5 carbs'
          });
          profile.protein -= 3.5;
          profile.carbs   += 3.5;
        break;
        case '100% cardio':
          logger.log({ 
            level: 3, 
            msg: 'Exercise Breakdown adjustment '+profile.exercise_breakdown+' protein -6 protein +6 carbs'
          });
          profile.protein -= 6;
          profile.carbs   += 6;
        break;
        default:
          logger.log({ 
            level: 3, 
            msg: 'Exercise Breakdown no adjustment ' + profile.exercise_breakdown
          });
      }
    };

    function restingMetabolicRate() {
      
      switch(profile.gender) {

        case 'Male':
          profile.restingMetabolicRate =  Math.round( 66 + (6.23 * profile.weightlbs) + (12.7 * profile.height) - (6.8 * profile.age) );
          if (profile.waist > 40 || profile.waist > profile.bmi) {
            profile.bmiObesityFlag=true;
            logger.log({ 
              level: 3, 
              msg: 'Setting bmiObesityFlag ' + profile.bmiObesityFlag
            });
          }
        break;

        case 'Female':
          profile.restingMetabolicRate =  Math.round( 655 + (4.35 * profile.weightlbs) + (4.7 * profile.height) - (4.7 * profile.age) );
          if (profile.waist > 35 || profile.waist > profile.bmi){
            profile.bmiObesityFlag = true;
            logger.log({ 
              level: 3, 
              msg: 'Setting bmiObesityFlag ' + profile.bmiObesityFlag
            });
          }
        break;

      }

    };

    function basalAdjustment() {
      profile.basalMetabolicRate = Math.round(profile.restingMetabolicRate * profile.activityFactor, 1);
    };

    function occupationalAdjustment() {
      profile.occupationalMetabolicRate = Math.round(profile.occupationalFactor * profile.basalMetabolicRate, 1);
    };

    function harrisonAdjustment() {
      profile.harrisonMetabolicRate = Math.round(profile.occupationalMetabolicRate * profile.harrisonFactor, 1);
    };

    function cardioAdjustment() {
      switch(profile.exercise_breakdown) {
        case '75% cardio and 25% weights':
          profile.harrisonMetabolicRate = profile.harrisonMetabolicRate * 1.025;
        break;
        case '100% cardio':
          profile.harrisonMetabolicRate = profile.harrisonMetabolicRate * 1.05;
        break;
        default:
          logger.log({ 
              level: 3, 
              msg: 'no cardio adjustment for exercise_breakdown:' + profile.exercise_breakdown
            });
      }

    };

    function periodicRateAdjustment() {
      //todo: get member since date
      //determine if we need a periodic adjustment
      switch(profile.goal) {
        case 'Strengthen Muscle and Loose 10% Weight':
         profile.periodicMetabolicAdjustmentFlag = true;
         profile.periodicMetabolicAdjustmentRate = 3;
         profile.periodicMetabolicAdjustmentPercent = 1.1;
        break;
        case 'Loose Over 10% Weight':
         profile.periodicMetabolicAdjustmentFlag = true;
         profile.periodicMetabolicAdjustmentRate = 3;
         profile.periodicMetabolicAdjustmentPercent = 1.1;
        break;
        case 'Tone and Firm':
         profile.periodicMetabolicAdjustmentFlag = true;
         profile.periodicMetabolicAdjustmentRate = 3;
         profile.periodicMetabolicAdjustmentPercent = 1.1;
        break;
        default:
         logger.log({ 
              level: 3, 
              msg: 'no metabolic rate adjustment for profile.goal:' + profile.goal
            });
      }
      if(profile.periodicMetabolicAdjustmentRate > 0){
        if(intMembershipInDays % periodicMetabolicAdjustmentRate == 0){
            harrisonMetabolicRate = harrisonMetabolicRate * periodicMetabolicAdjustmentPercent;
        } 
      }
    };

    function mealsPerDayAdjustment() {
      switch(profile.meals_per_day) {
        case 3:
          profile.harrisonMetabolicRate = profile.harrisonMetabolicRate * .75;
        break;
        case 4:
          profile.harrisonMetabolicRate = profile.harrisonMetabolicRate * .9;
        break;
        default:
          logger.log({ 
            level: 3, 
            msg: 'no metabolic rate adjustment for profile.meals_per_day:' + profile.meals_per_day
          });
      }

    };
    
    function alternateFiberThreshold() {

      profile.altFiberThreshold=0;

      switch(profile.gender) {
        case 'Male':
          profile.altFiberThreshold = profile.metabolicTargets.daily_fiber_threshold_male;
        break;
        case 'Female':
          profile.altFiberThreshold = profile.metabolicTargets.daily_fiber_threshold_female;
        break;
      }

      if (profile.metabolicTargets.alternate_daily_fiber > 0 && profile.harrisonMetabolicRate > profile.altFiberThreshold) {
        profile.metabolicTargets.daily_fiber = profile.metabolicTargets.alternate_daily_fiber;
      } else {
        logger.log({ 
          level: 3, 
          msg: 'no alternate daily fiber adjustment required:'
        });
      }
    };

    function metabolicProfile() {
      var caloriespermeal = Math.round(profile.harrisonMetabolicRate/profile.meals_per_day,1)
      , gramsProteinPerMeal = Math.round((caloriespermeal*(profile.metabolicTargets.proteins_breakdown/100))/4,1)
      , caloriesFromProteinPerMeal = Math.round((caloriespermeal*(profile.metabolicTargets.proteins_breakdown/100)),1)
      , gramsCarbsPerMeal = Math.round((caloriespermeal*(profile.metabolicTargets.carbs_breakdown/100))/4,1)
      , caloriesFromCarbsPerMeal = Math.round((caloriespermeal*(profile.metabolicTargets.carbs_breakdown/100)),1)
      , gramsFatPerMeal = Math.round((caloriespermeal*(profile.metabolicTargets.fats_breakdown/100))/9,1)
      , caloriesFromFatPerMeal = Math.round((caloriespermeal*(profile.metabolicTargets.fats_breakdown/100)),1)
      , caloriesFromCarbsPerMeal = Math.round((caloriespermeal*(profile.metabolicTargets.carbs_breakdown/100)),1)
      , gramsFiberousCarbsPerMeal = profile.metabolicTargets.daily_fibers/profile.meals_per_day
      , totalCaloriesPerMeal = Math.round((caloriesFromProteinPerMeal+caloriesFromCarbsPerMeal+caloriesFromFatPerMeal),1)
      , totalGramsPerMeal = Math.round((gramsProteinPerMeal+gramsCarbsPerMeal+gramsFatPerMeal),1)
      ;

      profile.metabolicProfile = {
        gramsProteinPerMeal : caloriesFromProteinPerMeal,
        caloriespermeal : caloriespermeal,
        //divide by four to get protein calories to grams
        gramsCarbsPerMeal : gramsCarbsPerMeal,
        caloriesFromProteinPerMeal : caloriesFromProteinPerMeal,
        //divide by four to get carb calories to grams
        caloriesFromCarbsPerMeal : caloriesFromCarbsPerMeal,
        //divide by four to get fat calories to grams
        gramsFatPerMealgramsFatPerMeal : gramsFatPerMeal,
        caloriesFromFatPerMeal : caloriesFromFatPerMeal,
        gramsFiberousCarbsPerMeal : gramsFiberousCarbsPerMeal,
        caloriesFiberousCarbsPerMeal : 0,
        gramsSimpleCarbsPerMeal : 0,
        caloriesSimpleCarbsPerMeal : 0,
        totalCaloriesPerMeal : totalCaloriesPerMeal,
        totalGramsPerMeal : totalGramsPerMeal
      }

    };

    function scrubProfile() {
        // clean out PII data
        var scrubbedProfile = {
          username:               profile.username,
          firstname:              profile.firstname,
          gender:                 profile.gender,
          age:                    profile.age,
          heightfeet:             profile.heightfeet,
          heightinches:           profile.heightinches,
          weightlbs:              profile.weightlbs,
          waistinches:            profile.waistinches,
          occupation:             profile.occupation,
          goal:                   profile.goal,
          exercise_regimen:       profile.exercise_regimen,
          exercise_breakdown:     profile.exercise_breakdown,
          meals_per_day:          profile.meals_per_day,
          errors:                 profile.errors,
          warnings:               profile.warnings,
          metabolicTargets:       profile.metabolicTargets,
          harrisonMetabolicRate:  profile.harrisonMetabolicRate,
          bmi:                    profile.bmi
        };

        return scrubbedProfile;
    };


    return {
      profile: scrubProfile(profile)
    };
};


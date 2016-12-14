const request = require('request').defaults({ encoding: null });


const VISION_URL = "http://api.projectoxford.ai/vision/v1.0/analyze?visualFeatures=Description&language=en";

/** 
 *  Gets the caption of the image from an image stream
 * @param {stream} stream The stream to an image.
 * @return (Promise) Promise with caption string if succeeded, error otherwise
 */
exports.getCaptionFromStream = stream => {
    return new Promise(
        (resolve, reject) => {
            const requestData = {
                url: VISION_URL,
                encoding: 'binary',
                headers: { "Ocp-Apim-Subscription-Key":"fbf137b1fd234e829c348fb8ffbb2a09",'content-type': 'application/octet-stream' }
            };

            stream.pipe(request.post(requestData, (error, response, body) => {
                if (error) {
                    console.log(error)
                    reject(error);
                }
                else if (response.statusCode != 200) {
                    reject(body);
                }
                else {
                    resolve(extractCaption(JSON.parse(body)));
                }
            }));
        }
    );
}

exports.getUrl = url => {
        return new Promise(
        (resolve, reject) => {
            request.get(url, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                else if (response.statusCode != 200) {
                    reject(body);
                }
                else {
                    resolve(extractCaption(body));
                }
            });
        }
    );
}

/** 
 * Gets the caption of the image from an image URL
 * @param {string} url The URL to an image.
 * @return (Promise) Promise with caption string if succeeded, error otherwise
 */
exports.getCaptionFromUrl = url => {
    return new Promise(
        (resolve, reject) => {
            const requestData = {
                uri: VISION_URL,
                method: "POST",
                headers: {"Ocp-Apim-Subscription-Key":"fbf137b1fd234e829c348fb8ffbb2a09"},
                json: { "url": url }
            };

            request(requestData, (error, response, body) => {
                if (error) {
                    reject(error);
                }
                else if (response.statusCode != 200) {
                    reject(body);
                }
                else {
                    console.log(extractCaption(body))
                    resolve(extractCaption(body));
                }
            });
        }
    );
}

exports.getCaptionFromUrlMy = url => {
    var options = {
      uri: VISION_URL,
      method: 'POST',
      headers: {'Content-Type':'application/json', 'Ocp-Apim-Subscription-Key':'fbf137b1fd234e829c348fb8ffbb2a09'},
      json: {
        "url": url
      }
    };
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body) // Print the shortened url.
      }else{
        console.log(error)
      }
    });

}





/**
 * Extracts the caption description from the response of the Vision API
 * @param {Object} body Response of the Vision API
 * @return {string} Description if caption found, null otherwise.
 */
const extractCaption = body => {
    if (body && body.description && body.description.captions && body.description.captions.length) {
        return body.description.captions[0].text
    }

    return null;
}

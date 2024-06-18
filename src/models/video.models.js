import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        duration:{
            type: Number,   // cloudnary url
            required: true
        },
        videoFile: {
            type: String,  // cloudnary url
            required: true
        },
        thumbnail: {
            type: String,  // cloudnary url
            required: true
        },
        owner:{
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: false
        }
        
    },
    {timestamps: true}
)

videoSchema.plugin(mongooseAggregatePaginate)
// plugin hook is used to add aggregate functionality to the schema

export const Video = mongoose.model("Video",videoSchema);


/*
Plugin Usage: The mongooseAggregatePaginate plugin adds pagination support to the schema's aggregate queries.

mongooseAggregatePaginate Plugin
The mongoose-aggregate-paginate-v2 plugin adds pagination capabilities to Mongoose's aggregation framework.
This is particularly useful when you want to perform complex queries and still have the ability to paginate the results.

Key Features of the Plugin:
- Pagination: Allows you to paginate results from aggregate queries, making it easier to handle large datasets by dividing them into manageable chunks (pages).
- Customizable: You can specify the page number, page size, and even sort criteria for your paginated results.
- Usage: Typically, after attaching the plugin to a schema, you can call the aggregatePaginate method on an aggregate object to get paginated results.


Example of how you might use the `aggregatePaginate` method:

// Example aggregation pipeline to find published videos and sort by views
const aggregate = Video.aggregate([
  { $match: { isPublished: true } },
  { $sort: { views: -1 } } // Sort by views in descending order
]);

// Pagination options
const options = {
  page: 1,   // Starting page
  limit: 10  // Number of documents per page
};

// Using aggregatePaginate method to paginate results
Video.aggregatePaginate(aggregate, options)
  .then(result => {
    console.log('Paginated Video Results:');
    console.log(result);
  })
  .catch(err => {
    console.error('Error paginating videos:', err);
  });

  
*/



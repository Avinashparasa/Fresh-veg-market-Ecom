const express=require("express");
const cors=require("cors");
const mongoose=require("mongoose");
const dotenv=require("dotenv").config();

const app=express();
app.use(cors());
app.use(express.json({limit:"10mb"}));

const PORT=process.env.PORT||8080


mongoose.connect(process.env.MONGODB_URL).then(()=>console.log("connected")).catch((err)=>console.log(err));

const userSchema=mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type:String,
        unique:true,
    },
    password: String,
    confirmPassWord: String,
    image:String,
})

const userModel=mongoose.model("user",userSchema);
app.get("/",(req,res)=>{
    res.send("server is running")
})

app.post("/signup", async (req, res) => {
    console.log(req.body);
    const { email } = req.body;

    try {
        const existingUser = await userModel.findOne({ email: email });

        if (existingUser) {
             res.send({ message: "Email already exists",alert:false });
        } else {
            const newUser = new userModel(req.body);
            await newUser.save();
             res.send({ message: "Registration completed",alert:true });
        }
    } catch (error) {
        console.error("Error in signup:", error);
         res.send({ message: "Internal server error" });
    }
});

app.post("/login",async(req,res)=>{
    console.log(req.body);
    const {email}=req.body;
   try{
    const existingUser = await userModel.findOne({ email: email });
      if(existingUser){
        
        const dataSend={
         _id:existingUser._id,      
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,        
        image:existingUser.image,
    }
    console.log(dataSend);
        res.send({message:"Succesfully login",alert:"true",data:dataSend})
      }else{
        res.send({message:"Email is not registered",alert:false});
      }
   }
   catch (error) {
    console.error("Error in signup:", error);
     res.send({ message: "Internal server error" });
}
    

})


const schemaProduct=mongoose.Schema({
    name:String,
    category:String,
    image:String,
    price:String,
    description:String,
})

const productModel=mongoose.model("product",schemaProduct);


app.post("/uploadProduct",async(req,res)=>{
   
    const data=await productModel(req.body);
    const savedData= await data.save();
    console.log(savedData);
    res.send({message:"Upload Successfull"})
})

app.get("/product",async(req,res)=>{
    const data=await productModel.find({})
    res.send(JSON.stringify(data))
    console.log("hi")
})
app.listen(PORT,()=>{
    console.log("server");
})
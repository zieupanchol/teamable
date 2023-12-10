<template>
    <div v-show="!isEditMode">
        <h1><b>User profile</b></h1>
        <img :src=mypic>
        <span>Name:</span><b>{{ name }}</b>
        <hr>
        <span>Email:</span><b>{{ email }}</b>
        <hr>
        <span>Interests:</span><b>{{ interests }}</b>
        <hr>
        <button :style="{ backgroundColor: bgColor }" @click="handleEditProfile">Edit Profile</button>
    </div>

    <div v-show="isEditMode">
        <h1><b>User profile</b></h1>
        <img :src=mypic>
        <span>Name:</span>
        <input type="text" v-model="name">
        <hr>
        <span>Email:</span>
        <input type="text" v-model="email">
        <hr>
        <span>Interests:</span>
        <input type="text" v-model="interests">
        <hr>
        <button :style="{ backgroundColor }" @click="handleUpdateProfile">Update Profile</button>
    </div>
</template>

<script>
import image from "./profile.jpeg"
export default {
    name: 'App',
    data() {
        return {
            mypic: image,
            name: "",
            email: "",
            interests: "",
            isEditMode: false,
            backgroundColor: "purple",
            bgColor: "brown"
        }
    },
    async created() {
        const userData = await this.fetctUserProfile()
        this.name = userData.name
        this.email = userData.email
        this.interests = userData.interests
    },
    methods: {
        handleEditProfile() {
            this.isEditMode = true

        },

        async handleUpdateProfile() {
            const payload = {
                name: this.name,
                email: this.email,
                interests: this.interests
            }
            const resJson = await this.updateUserProfile(payload)
            console.log(resJson)
            this.isEditMode = false
        },
        async fetctUserProfile() {
            const res = await fetch('get-user-profile')
            return await res.json()
        },
        async updateUserProfile(payload) {
            const res = await fetch('save-user-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            return await res.json()
        }
    }
}
</script>

<style>
img {
    width: 320px;
    height: 270px;
    display: block;
    margin-bottom: 40px;
}


hr {
    margin: 25px 0px;
    width: 400px;
}

button {
    padding: 8px;
    width: 120px;
    border-radius: 5px;
    background-color: blue;
    color: white;
}

div {
    width: 80%;
    margin: 40px auto;
}

button:hover {
    cursor: pointer;

}

.datepicker {
    position: relative;
    margin-bottom: 0px;
    margin-top: 0px;
}
</style>
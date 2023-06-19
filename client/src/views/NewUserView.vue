<template>
    <div class="container mt-5">
        <div class="form-floating my-3">
              <input
                type="text"
                class="form-control"
                id=""
                placeholder="name@example.com"
                v-model="state.user.email"
                @input="v$.user.email.$touch()"
                :class="{ 'is-invalid': v$.user.email.$error }"
              />
              <label for="floatingEmail">Email address</label>
              <p v-if="v$.user.email.$error" class="invalid-feedback">
                {{ v$.user.email.$errors[0].$message }}
              </p>
            </div>
    </div>
</template>

<script>
export default {
    name: "NewUserView",
    data() {
        return {
            fullName: "",
            preferredName: "",
            functionID: "",
            deptID: "",
            joinedDate: "",
            positionID: "",
            contactNo: "",
            aisecEmail: "",
            gender: "",
            nicNumber: "",
            birthDate: "",
            facebookLink: "",
            linkedinLink: "",
            instagramLink: "",
            facultyID: "",
            batch: "",
            uniRegNo: "",
            schoolName: "",
            homeAddress: "",
            homeContact: "",
            district: "",
            photoLink: "",
            boardingAddress: "",
            personalEmail: "",
            userPassword: "",
        }
    },
}
</script>
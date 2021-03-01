<template>
  <v-row justify="center">
    <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-form
              ref="form"
              lazy-validation
              v-model="valid"
          >
            <v-text-field
                v-model="getSchema.title"
                label="Title"
                :rules="titleRules"
                required
            ></v-text-field>
            <v-text-field
                v-model="getSchema.price"
                label="Price"
                :rules="priceRules"
                required
            ></v-text-field>
            <v-text-field
                v-model="getSchema.description"
                label="Description"
                :rules="descRules"
                required
            ></v-text-field>

            <v-file-input
                v-model="getSchema.image"
                accept="image/*"
                label="File input"
                :rules="imageRules"
                required
            ></v-file-input>

            <v-flex sm3 md2>
              <v-img
                  :src="imageUrl"
                  width="160"
                  v-if="imageUrl"
              ></v-img>
            </v-flex>

            <v-checkbox
                v-model="getSchema.status"
                label="Active"
                type="checkbox"
                color="indigo darken-3"
            ></v-checkbox>
          </v-form>

        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
              color="blue darken-1"
              text
              @click.stop.prevent="validationForm()"
          >
            {{ buttonTitle }}
          </v-btn>

          <v-btn
              color="blue darken-1"
              text
              @click="close"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>


export default {
  props: ["dialogStatus", "editedData", "indexEdited"],

  data: () => ({
    valid: true,
    titleRules: [
      v => !!v || 'Title is required',
    ],
    descRules: [
      v => !!v || 'Description is required',
    ],
    priceRules: [
      v => !!v || 'Price is required',
    ],
    imageRules: [
      v => !!v || 'Product image is required',
    ],
    dialog: false,
    editedStatus: false,
    imageUrl: ''
  }),

  computed: {
    getSchema() {
      return this.$store.getters.setSchemaData;
    },
    buttonTitle() {
      return this.indexEdited === -1 ? "Submit" : "Edit";
    },
    formTitle() {
      return this.indexEdited === -1 ? "Create New Item" : "Edit Item";
    }
  },

  methods: {
    validationForm() {
      const isValid = this.$refs.form.validate();
      if (isValid) {
        this.indexEdited === -1 ? this.save() : this.edit();
      }
    },


    save() {
      let self = this;
      let item = this.getSchema;

      let formData = new FormData();
      formData.append('title', item.title);
      formData.append('description', item.description);
      formData.append('price', item.price);
      formData.append('image', item.image);
      formData.append('status', item.status);

      this.$store
          .dispatch("saveNewItem", formData)
          .then(function () {
            try {
              self.close();
              self.$store.dispatch("fetchProductList");
            } catch (ex) {
              console.log(ex);
            }
          })
          .catch(function (error) {
            console.log(error);
            self.$store.dispatch("fetchProductList");
          });
    },


    edit() {
      let self = this;
      let item = this.getSchema;

      let fd = new FormData();
      fd.append('title', item.title);
      fd.append('description', item.description);
      fd.append('price', item.price);
      fd.append('image', item.image);
      fd.append('status', item.status);
      fd.append('_method', 'put');

      this.$store
          .dispatch("updateItem", {formData: fd, id: item.id})
          .then(function () {
            try {
              self.close();
              self.$store.dispatch("fetchProductList");
            } catch (ex) {
              console.log(ex);
            }
          })
          .catch(function (error) {
            console.log(error);
            self.$store.dispatch("fetchProductList");
          });
    },


    settingsData() {
      if (this.getSchema.image) {
        this.imageUrl = this.getSchema.image;
        this.getSchema.image = null;
      }
    },

    clear() {
      this.$refs.form.resetValidation()
    },
    close() {
      this.$emit("update:dialogStatus", false);
      setTimeout(() => {
        this.$emit("update:indexEdited", -1);
      }, 300);
      this.clear();
    }
  },

  watch: {
    dialogStatus(val) {
      this.dialog = val;
      this.$store.commit("SET_PRODUCT_FORM_DATA", this.editedData);
      this.settingsData();
    },
    dialog(val) {
      if (!val) this.close();
    }
  },
}
</script>

<style scoped>

</style>
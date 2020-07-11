<template>
  <v-container v-show="isAdmin">
    <v-card tile>
      <v-card-title>Administration Page</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="bannedPlayers"
          :items-per-page="5"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="transparent">
              <v-toolbar-title>Banned Players</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn color="primary" class="mb-2" v-bind="attrs" v-on="on">Add Player</v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle() }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="6" md="12">
                          <v-text-field v-model="editedItem.battleTag" label="BattleTag"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                          <v-text-field
                            v-model="editedItem.endDate"
                            hint="YYYY-MM-DD format"
                            persistent-hint
                            label="Ban End Date"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="12">
                          <v-select
                            v-model="editedItem.ipBanValue"
                            :items="['true', 'false']"
                            label="Is Ip Banned"
                            :item-value="editedItem.ipBanValue"
                            required
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                          <v-text-field v-model="editedItem.banReason" label="Ban Reason"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch} from "vue-property-decorator";
import { BannedPlayer } from "../store/admin/types";
import { PlayerProfile } from "../store/player/types";
@Component({ components: {} })
export default class Admin extends Vue {
  data() {
    return {
      headers: [
        {
          text: "BattleTag",
          align: "start",
          sortable: false,
          value: "battleTag",
        },
        { text: "Ban End Date", value: "endDate" },
        { text: "Is IP Banned?", value: "isIpBan" },
        { text: "Ban Reason", value: "banReason" },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  }

  get bannedPlayers(): BannedPlayer[] {
    return this.$store.direct.state.admin.players;
  }

  get isAdmin(): boolean {
    return this.$store.direct.state.oauth.isAdmin;
  }

  @Watch("isAdmin")
  onBattleTagChanged() {
    this.init();
  }

  private async init() {
    if (this.isAdmin) {
      await this.$store.direct.dispatch.admin.loadBannedPlayers();
    }
  }

  public dialog = false;
  public editedIndex = -1;
  public date = "";
  public editedItem = {
    battleTag: "",
    endDate: "",
    isIpBan: false,
    ipBanValue: "",
    banReason: "",
  };
  public defaultItem = {
    battleTag: "",
    endDate: "",
    isIpBan: false,
    ipBanValue: "",
    banReason: "",
  };

  editItem(item: BannedPlayer) {
    this.editedIndex = this.bannedPlayers.indexOf(item);

    if (this.editedIndex === -1) {
      this.editedItem = this.defaultItem;
    } else {
      this.editedItem = Object.assign({}, item);
    }
    this.dialog = true;
  }

  async deleteItem(item: BannedPlayer) {
    const index = this.bannedPlayers.indexOf(item);
    confirm("Are you sure you want to delete this item?") &&
      this.bannedPlayers.splice(index, 1);
    await this.$store.direct.dispatch.admin.deleteBan(item);
  }

  formTitle() {
    return this.editedIndex === -1 ? "New Item" : "Edit Item";
  }

  async save() {
    this.editedItem.isIpBan = this.editedItem.ipBanValue == "true";

    if (this.editedIndex > -1) {
      Object.assign(this.bannedPlayers[this.editedIndex], this.editedItem);
    } else {
      this.bannedPlayers.push(this.editedItem);
    }
    await this.$store.direct.dispatch.admin.postBan(this.editedItem);

    this.close();
  }

  close() {
    this.dialog = false;
    this.$nextTick(() => {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    });
  }

  async mounted() {
    await this.init();
  }
}
</script>
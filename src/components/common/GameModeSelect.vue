<template>
  <v-menu offset-x>
    <template v-slot:activator="{ on }">
      <v-btn tile v-on="on" class="transparent">
        <v-icon style="margin-right: 5px;">mdi-controller-classic</v-icon>
        {{ gameModeName }}
      </v-btn>
    </template>
    <v-card>
      <v-card-text>
        <v-list>
          <v-list-item-content>
            <v-list-item-title>Select a gamemode:</v-list-item-title>
          </v-list-item-content>
        </v-list>
        <v-divider></v-divider>
        <v-list dense>
          <v-list-item
            v-for="mode in gameModes"
            :key="mode.gameMode"
            @click="selectGameMode(mode.gameMode)"
          >
            <v-list-item-content>
              <v-list-item-title>{{ mode.modeName }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { TranslateResult } from "node_modules/vue-i18n/types/index.d";
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

import { EGameMode, GameModeName } from "../../store/typings";

@Component({})
export default class GameModeSelect extends Vue {
  @Prop() gameMode?: EGameMode;
  @Prop() disabledModes?: EGameMode[];

  get gameModes(): GameModeName[] {
    let modes = [
      {
        modeName: this.$t(`gameModes.${EGameMode[EGameMode.GM_1ON1]}`),
        modeId: EGameMode.GM_1ON1,
      },
      {
        modeName: this.$t(`gameModes.${EGameMode[EGameMode.GM_2ON2]}`),
        modeId: EGameMode.GM_2ON2,
      },
      {
        modeName: this.$t(`gameModes.${EGameMode[EGameMode.GM_2ON2_AT]}`),
        modeId: EGameMode.GM_2ON2_AT,
      },
      {
        modeName: this.$t(`gameModes.${EGameMode[EGameMode.GM_4ON4]}`),
        modeId: EGameMode.GM_4ON4,
      },
      {
        modeName: this.$t(`gameModes.${EGameMode[EGameMode.GM_FFA]}`),
        modeId: EGameMode.GM_FFA,
      },
      {
        modeName: `Footmen Frenzy`,
        modeId: EGameMode.GM_FOOTMEN_FRENZY,
      },
    ];

    if (this.disabledModes) {
      modes = modes.filter(x => !this.disabledModes?.includes(x.modeId))
    }

    return modes;
  }

  get gameModeName(): TranslateResult | string {
    if (!this.gameMode) {
      return '';
    }

    const mode = this.gameModes.filter((g) => g.modeId == this.gameMode)[0];

    if (!mode) {
      return 'Not Supported';
    }

    return mode.modeName;
  }

  public selectGameMode(gameMode: EGameMode): void {
    this.$emit("gameModeChanged", gameMode);
  }
}
</script>

<style></style>
